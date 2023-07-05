from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import response

class UserStaffRestricedModelViewsetMixin:
    
    @classmethod
    def emulate(cls, request, **kwargs):
        obj = cls()
        obj.request = request
        obj.format_kwarg = None
        
        def pop_data(function) -> dict:
            def wrapper(*args, **kwargs):
                kwargs['request'] = request
                return function(*args, **kwargs).data
            return wrapper
        
        POP_FUNCS = ["list", "retrieve", "create", "update", "partial_update", "destroy"]
        for func in POP_FUNCS:
            if hasattr(obj, func):
                setattr(obj, func, pop_data(getattr(obj, func)))
        return obj
        

    def check_unallowed_args(self, kwargs):
        res = []
        for item in self.not_user_editable:
            if item in kwargs:
                res.append(item)
        return res
    
    def get_object(self):
        if not self.request.user.is_staff:
            self.kwargs["pk"] = self.request.user.id
        else:
            if not "pk" in self.kwargs:
                self.kwargs["pk"] = self.request.user.id
                
        if isinstance(self.kwargs["pk"], int):
            return super().get_object()
        elif self.kwargs["pk"].isnumeric():
            self.kwargs["pk"] = int(self.kwargs["pk"])
            # assume uuid
            return super().get_object()
        else:
            return super().get_queryset().get(uuid=self.kwargs["pk"])

    def update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            unallowed_args = self.check_unallowed_args(request.data)
            if len(unallowed_args) > 0:
                return response.Response({arg: "Not User editable" for arg in unallowed_args},status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        if not self.request.user.is_staff:
            return super().get_queryset().filter(user=self.request.user)
        else:
            return super().get_queryset()
        
    def get_permissions(self):
        if self.action == 'list' and (not self.allow_user_list):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
